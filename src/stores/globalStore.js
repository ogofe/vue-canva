import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const fabricObjects = ref([]);
  const currentSelection = reactive({type: null, element: null}); 
  const flyerImage = ref(null);
  const editor = reactive({canvas: null});
  const editView = reactive({ type: 'textbox', action: 'create', scope: null });
  const objectDefaults = reactive({
    fontFamily: 'Times New Roman',
    fontSize: 14,
  });

  function changeEditView({ type, action, scope }){
    editView.type = type
    editView.action = action
    editView.scope = scope
  }

  function changeObjectDefault(key, value) {
    objectDefaults[key] = value;
  }

  function selectObject(fabricObj) {
    if (fabricObj !== null){
      currentSelection.type = fabricObj.type;
      currentSelection.element = fabricObj;
    }else{
      currentSelection.type = null;
      currentSelection.element = null;
    }
  }

  function setFlyerImage(img) {
    flyerImage.value = img;
  }

  function addObject(fabricObj) {
    fabricObjects.value.push({
      type: fabricObj.type,
      element: fabricObj.element,
    });
    selectObject(fabricObj.element);
  }

  function deleteObject() {
    if (currentSelection.type === 'selection'){
      editor.canvas.remove(currentSelection.element);
    }else{
      editor.canvas.remove(currentSelection.element);
    }
    editor.canvas.renderAll();
  }

  function setEditor(obj){
    editor['canvas'] = obj
  }

  function addObjectToCanvas(object) {
    try {
      editor.canvas.add(object);
      editor.canvas.setActiveObject(object);
      object.selectable = true;
      editor.canvas.renderAll();
    } catch (error) {
      alert("Error adding object: " + error.message);
    }
  }  

  return {
    editor,
    setEditor,
    fabricObjects,
    objectDefaults,
    flyerImage,
    setFlyerImage,
    addObject,
    addObjectToCanvas,
    currentSelection,
    selectObject,
    changeObjectDefault,
    editView,
    deleteObject,
    changeEditView,
  };
});

