function regex_exec (str: string, r: RegExp): any {
  const regex = new RegExp(r);
  return regex.exec(str);
}


export { regex_exec };
