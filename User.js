export class User {
  #name = "";

  // Session storage name retrieval
  hasName() {
    return sessionStorage.getItem("name") !== null;
  }

  // Cookie storage name retrieval - old and ugly
  hasNameInCookie() {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("name="));
  }

  hasLocalStorage() {
    return localStorage.getItem(this.name) !== null;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = typeof name === "string" ? name : "";
  }
}
