const validateNumber = (number) => {
    return Number.isFinite(number) && number > 0;
  };
  
  export { validateNumber };