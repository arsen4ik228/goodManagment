// config.js или constants.js
export const baseUrl = "http://localhost:5000/";

export const formattedDate = (date) => {
    return date?.slice(0,10).split('-').reverse().join('.')
}
export const resizeTextarea = (id) => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  export const transformArraiesForUpdate = (array) => {
    const updatedArray = array.map(item => ({
      _id: item?.id,
      content: item?.content,
      dateStart: item?.dateStart,
      deadline: item?.deadline,
      holderUserId: item?.holderUserId,
      targetState: item?.targetState,
      type: item?.type
    }))
        // setFunction(updatedArray);

        return updatedArray; // Явно возвращаем массив
  }