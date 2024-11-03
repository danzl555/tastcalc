// Функция для заполнения выпадающего списка типов материалов на основе конфигурации
// Добавляет опции с типами материалов в select элемент с id "materialType"
export function populateMaterialTypeOptions(config) {
  const materialTypeSelect = document.getElementById("materialType");
  const materialTypes = config.filter((item) => item.type === "material");

  materialTypes.forEach((materialType) => {
      const option = document.createElement("option"); 
      option.value = materialType.key;
      option.textContent = materialType.name; 
      materialTypeSelect.appendChild(option); 
  });
}

// Функция для заполнения выпадающего списка материалов на основе выбранного типа материала
// Если тип материала задан, фильтрует материалы по выбранному типу
export function populateMaterialOptions(data, materialType = "") {
  const materialSelect = document.getElementById("material"); 
  materialSelect.innerHTML = ""; 

  // Фильтруем материалы по типу "list" и, при необходимости, по типу материала
  const filteredMaterials = data.filter(
      (item) =>
          item.type === "list" &&
          (materialType ? item.material === materialType : true)
  );

  filteredMaterials.forEach((material) => {
      const option = document.createElement("option"); 
      option.value = material.name; 
      option.textContent = `${material.name} - ${material.width} м ширина`; 
      materialSelect.appendChild(option); 
  });
}

// Функция для заполнения выпадающих списков типов труб и прочности каркаса
// Добавляет опции для труб и прочности на основе данных и конфигурации
export function populatePipeAndStrengthOptions(data, config) {
  const pipeSelect = document.getElementById("pipeType");
  data
      .filter((item) => item.type === "pipe") 
      .forEach((pipe) => {
          const option = document.createElement("option"); 
          option.value = pipe.name; 
          option.textContent = pipe.name; 
          pipeSelect.appendChild(option); 
      });

  const strengthSelect = document.getElementById("strength"); 
  config
      .filter((item) => item.type === "frame") 
      .forEach((frame) => {
          const option = document.createElement("option"); 
          option.value = frame.key; 
          option.textContent = frame.name; 
          strengthSelect.appendChild(option); 
      });
}
