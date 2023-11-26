function getUserFromCookie(){
    const cookie = document.cookie.split("; ");
    const user = cookie.find((row) => row.startsWith('user' + "="));
  
    if(user) {
      const data = decodeURIComponent(user.split("=")[1]);
      const json = data.startsWith("j:") ? data.substring(2) : data;
      try {
        return JSON.parse(json);
      } catch (error) {
        console.error("Erro ao analisar dados do cookie:", error);
        return null;
      }
    }

    return null;
}