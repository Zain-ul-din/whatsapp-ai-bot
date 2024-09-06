class MessageTemplates {
  public static requestStr(model: string, from: string, prompt: string): string {
    return `${model}Model fetching | prompt:"${prompt}" from user:"${from}"\n`;
  }

  public static reqSucceedStr(
    model: string,
    from: string,
    response: string,
    timeTook: number
  ): string {
    return `${model}Model succeed | reply has been sent to user:"${from}" response:${response}  <Done in ${timeTook} ms>\n\n`;
  }

  public static reqFailStr(model: string, errInfo: string, err: any) {
    return `${model}Model request fail | An error occur, ${errInfo} err: ${err}\n`;
  }
}

export { MessageTemplates };
