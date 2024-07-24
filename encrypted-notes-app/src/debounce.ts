// 제네릭 debounce 다양한 인자 타입 허용, 지연 시간 후 함수 호출
const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) => {
  let timeoutID: number | undefined;

  const debounced = (...args: Args) => {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn(...args), delay);
  };

  return debounced;
};

export default debounce;
