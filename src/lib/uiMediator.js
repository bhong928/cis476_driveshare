// /src/lib/uiMediator.js
class UIMediator {
    constructor() {
      this.components = {};
    }
  
    register(componentName, instance) {
      this.components[componentName] = instance;
    }
  
    notify(sender, event, data) {
      // For example, if the event is "showToast" and there's a Toast component registered, call its show method.
      if (event === "showToast" && this.components["Toast"]) {
        this.components["Toast"].show(data);
      }
      // Extend this function to handle other events and components as needed.
    }
  }
  
  const uiMediator = new UIMediator();
  export default uiMediator;