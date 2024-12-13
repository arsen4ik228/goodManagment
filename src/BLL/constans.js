// config.js или constants.js
export const baseUrl = "http://localhost:5000/";
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