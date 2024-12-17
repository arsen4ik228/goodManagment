// config.js или constants.js
export const baseUrl = "http://localhost:5002/";
// export const baseUrl = "https://24academy.ru/gm/";

export const formattedDate = (date) => {
  return date?.slice(0, 10).split('-').reverse().join('.')
}
export const resizeTextarea = (id) => {
  const textarea = document.getElementById(id);
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
};

// export const transformArraiesForUpdate = (array) => {
//   const updatedArray = array.map(item => {
//     if (item.holderUserIdchange === item.holderUserId)
//       return {
//         _id: item?.id,
//         content: item?.content,
//         dateStart: item?.dateStart,
//         deadline: item?.deadline,
//         targetState: item?.targetState,
//         type: item?.type
//       }
//     else {
//       return {
//         _id: item?.id,
//         content: item?.content,
//         dateStart: item?.dateStart,
//         deadline: item?.deadline,
//         holderUserId: item?.holderUserId,
//         targetState: item?.targetState,
//         type: item?.type
//       }
//     }
//   }
//   )

//   return updatedArray; 
// }

export const transformArraiesForUpdate = (array) => {
  const updatedArray = array.map(item => {
      return {
        _id: item?.id,
        content: item?.content,
        dateStart: item?.dateStart,
        deadline: item?.deadline,
        targetState: item?.targetState,
        type: item?.type,
        ...(item.holderUserIdchange !== item.holderUserId && {
          holderUserId: item?.holderUserId,
        })
      }
  }
  )
  // setFunction(updatedArray);  holderUserIdchange

  return updatedArray; // Явно возвращаем массив
}

export const getDateFormatSatatistic = (date, typeGraphic) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();

  const months = [
    "янв",
    "фев",
    "март",
    "апр",
    "май",
    "июнь",
    "июль",
    "авг",
    "сент",
    "окт",
    "нояб",
    "дек",
  ];

  if (typeGraphic === "Ежемесячный") {
    return `${months[monthIndex]}-${year}`;
  }

  if (typeGraphic === "Ежегодовой") {
    return `${year}`;
  }

  // Формат по умолчанию
  return dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

 export function arraysEqualWithObjects(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Сравниваем все поля объекта
    if (
      typeof obj1 === 'object' &&
      typeof obj2 === 'object' &&
      JSON.stringify(obj1) !== JSON.stringify(obj2)
    ) {
      return false;
    }
  }

  return true;
}
