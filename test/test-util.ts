function regex_exec (str: string, r: RegExp|string): RegExpExecArray {
  const regex = new RegExp(r);
  return regex.exec(str);
}

export { regex_exec };
