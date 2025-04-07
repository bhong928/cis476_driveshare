// /src/lib/uiMediator.js
class UIMediator {
    constructor() {
      this.components = {};
    }
  
    // Registers a component with a unique name
    register(componentName, instance) {
      this.components[componentName] = instance;
    }
  
    // Notifies a component by name, passing an event and data
    notify(componentName, event, data) {
      const component = this.components[componentName];
      if (component && typeof component.handleEvent === "function") {
        component.handleEvent(event, data);
      }
    }
  }
  
  const uiMediator = new UIMediator();
  export default uiMediator;