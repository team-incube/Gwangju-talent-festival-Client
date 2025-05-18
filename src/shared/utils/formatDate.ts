enum WEEKDAYS {
    '일' = 0,
    '월' = 1,
    '화' = 2,
    '수' = 3,
    '목' = 4,
    '금' = 5,
    '토' = 6,
}   

export const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, '0')}(${WEEKDAYS[date.getDay()]})`;
  };