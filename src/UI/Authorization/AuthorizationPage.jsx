import React, { useState, useEffect } from "react";
import style from "./AuthorizationPage.module.css"; // Ваши стили
// import telegram from "../../../image/telegram.svg"; 
import telegram from '../Custom/icon/telegram.svg'
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { baseUrl } from "../../BLL/constans";

//5000
const socket = io(`http://localhost:5002/auth`, {
  cors: {
    credentials: true
  },transports : ['websocket']
}); // Подключение к сокету

export default function AuthorizationPage() {




  const [data, setData] = useState({
    accessToken: "",
    refreshTokenId: "",
    userId: "",
  });
  const [tokenForTG, setTokenForTG] = useState("");
  const [socketId, setSocketId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [ip, setIp] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const userAgent = navigator.userAgent; // Получение User-Agent

  useEffect(() => {
    // Получение IP-адреса
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        console.log("IP-адрес:", data.ip);
        setIp(data.ip);
      })
      .catch((error) => {
        console.error("Ошибка при получении IP-адреса:", error);
      });

    // Инициализация FingerprintJS
    const fpPromise = FingerprintJS.load();
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const visitorId = result.visitorId;
        console.log("Fingerprint ID:", visitorId);
        setFingerprint(visitorId); // Сохраняем Fingerprint
      })
      .catch((error) => {
        console.error("Ошибка при получении Fingerprint:", error);
      });

    // Запрос к серверу для получения токена
    fetch(`http://localhost:5002/`, {
      method: "GET",
      headers: {
        "User-Agent": userAgent, // Отправляем User-Agent в заголовке
      },
    })
      .then((response) => response.json()) // Обрабатываем ответ как JSON
      .then((data) => {
        console.log("Ответ от /", data);
        console.log("tokenForTG", data.tokenForTG);
        setTokenForTG(data.tokenForTG);
      })
      .catch((error) => {
        console.error("Ошибка при запросе /:", error);
      });

    // Подключение сокета и получение socketId
    console.log("Попытка подключения к сокету...");
    socket.on("connect", () => {
      console.log("Сокет подключен, socket.id:", socket.id);
      setSocketId(socket.id); // Сохраняем socket.id
    });

    socket.on("disconnect", () => {
      console.log("Сокет отключен.");
    });

    // Очистка при размонтировании компонента
    return () => {
      console.log("Отключаем сокет...");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect(); // Закрываем соединение при размонтировании компонента
    };
  }, []); // Выполняется только один раз при монтировании компонента

  // Эффект для отправки данных после того, как все зависимости будут установлены
  useEffect(() => {
    if (fingerprint && ip && tokenForTG) {
      // Все данные готовы, подписываемся на событие requestInfo и отправляем
      socket.on("requestInfo", (data) => {
        console.log("Получено событие requestInfo:", data);
        // Отправляем ответ через responseFromClient
        console.log("--------------------");
        console.log(fingerprint);
        console.log(userAgent);
        console.log(ip);
        console.log(tokenForTG);
        console.log("--------------------");

        socket.emit("responseFromClient", {
          fingerprint: fingerprint,
          userAgent: userAgent,
          ip: ip,
          token: tokenForTG,
        });
      });

      socket.on("receiveAuthInfo", (authData) => {
        console.log("Получено событие receiveAuthInfo:", authData);
        // Обработка полученных данных
        setData(authData);
      });
    }
  }, [fingerprint, ip, tokenForTG]); // Зависимости эффекта

  // Перенаправление на другую страницу при наличии userId
  useEffect(() => {
    if (data.userId) {
      window.location.href = `#/${data.userId}/Chat`;
    }
  }, [data]);

  // Установка QR-кода при наличии tokenForTG и socketId
  useEffect(() => {
    if (tokenForTG && socketId) {
      setQrUrl(
        `tg://resolve?domain=GMAuthBot&start=${encodeURIComponent(
          tokenForTG
        )}-${encodeURIComponent(socketId)}`
      );
    }
  }, [socketId, tokenForTG]);

  console.log("tokenForTG:", tokenForTG);
  console.log("socketId:", socketId);

    return (
        <>
            <div className={style.Container}>
                <div className={style.background}></div>
                <div className={style.logoContainer}>
                    {/* <img src={logo} alt="Логотип компании" /> */}
                </div>

                <div className={style.textContainer}>
                    <img src={telegram} alt="Telegram" />
                    <a href={qrUrl} target="_blank" rel="noopener noreferrer" className={style.link}>Войти через Telegram</a>
                    {/* <Link to="6ac81119-f508-48ec-9d4a-6fb3328731c6"> <div>ВОЙТИ</div> </Link> */}
                    {/* <div>{data.sessionId}</div>        */}

                </div>
            </div>
        </>
    )
}
