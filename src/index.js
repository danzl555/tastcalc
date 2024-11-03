// index.js
import { calculateMaterials } from "./modules/calculator.js";
import { loadData, loadFormData } from "./modules/loader.js";
import {
  populateMaterialTypeOptions,
  populateMaterialOptions,
  populatePipeAndStrengthOptions,
} from "./modules/populate.js";

import './style/base.css';
import './style/layout.css';
import './style/module.css';
import './style/state.css';
import './style/theme.css';

let data = null;
let config = null;

async function initializeApp() {
  const formData = await loadFormData();
  data = formData.data;
  config = formData.config;

  // Заполняем опции в select-элементах
  populateMaterialTypeOptions(config);
  populatePipeAndStrengthOptions(data, config);

  // Установка ограничений для инпутов width и length
  const widthConfig = config.find(
    (item) => item.type === "size" && item.key === "width"
  );
  const lengthConfig = config.find(
    (item) => item.type === "size" && item.key === "length"
  );

  if (widthConfig) {
    const widthInput = document.getElementById("width");
    widthInput.min = widthConfig.min;
    widthInput.max = widthConfig.max;
    widthInput.step = widthConfig.step;
  }

  if (lengthConfig) {
    const lengthInput = document.getElementById("length");
    lengthInput.min = lengthConfig.min;
    lengthInput.max = lengthConfig.max;
    lengthInput.step = lengthConfig.step;
  }
}

function filterMaterials() {
  const selectedType = document.getElementById("materialType").value;
  populateMaterialOptions(data, selectedType);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  window.filterMaterials = filterMaterials;
  window.calculateMaterials = () => calculateMaterials(data, config);
});
