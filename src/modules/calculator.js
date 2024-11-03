// Функция для расчёта материалов, затрат и отображения результатов
export function calculateMaterials(data, config) {

    // Блок: Получение значений ширины, длины и выбранных материалов из формы
    const width = parseFloat(document.getElementById("width").value);
    const length = parseFloat(document.getElementById("length").value);
    const selectedMaterial = document.getElementById("material").value;
    const selectedPipeType = document.getElementById("pipeType").value;
    const selectedStrength = document.getElementById("strength").value;
  
    // Блок: Проверка корректности введённых размеров
    if (isNaN(width) || isNaN(length) || width < 5 || length < 5 || width > 25 || length > 50) {
        alert("Ширина: минимум 5 метров, максимум 25 метров;\nДлина: минимум 5 метров, максимум 50 метров");
        return;
    }
  
    // Блок: Поиск конфигураций и данных выбранных материалов, крепежей и труб
    const frameConfig = config.find(
        (item) => item.type === "frame" && item.key === selectedStrength
    );
    const material = data.find(
        (item) => item.type === "list" && item.name === selectedMaterial
    );
    const screwConfig = config.find(
        (item) => item.type === "fix" && item.key === material.material
    );
    const pipe = data.find(
        (item) => item.type === "pipe" && item.name === selectedPipeType
    );
    const screwData = data.find((item) => item.type === "fix");
  
    // Блок: Расчёт количества и стоимости листового материала
    const sheetWidth = material.width;
    const sheetArea = sheetWidth * 1; // Площадь одного листа материала (ширина x длина, длина всегда по условию = 1)
    const totalArea = width * length; 
    const numberOfSheets = Math.ceil(totalArea / sheetArea); 
    const sheetCost = numberOfSheets * material.price; 
  
    // Блок: Расчёт длины и стоимости труб для каркаса
    const maxStep = frameConfig.step; 
    const pipeWidth = pipe.width / 1000; 
    const pipeWidthAndMaxStep = maxStep + pipeWidth; 
    const difPipeAndWidth = width - pipeWidth; 
    const difPipeAndLength = length - pipeWidth; 
  
    // Блок: Вычисление количества труб по ширине и длине
    const numPipesWidth = (difPipeAndWidth / pipeWidthAndMaxStep) + 1; 
    const numPipesLength = (difPipeAndLength / pipeWidthAndMaxStep) + 1;
    const totalPipeLength = (numPipesWidth * length) + (numPipesLength * width); 
    const pipeCost = totalPipeLength * pipe.price; 
  
    // Блок: Расчёт количества и стоимости саморезов
    const screwsPerSquareMeter = screwConfig.value;
    const screwPrice = screwData.price; 
    const totalScrews = Math.ceil(totalArea * screwsPerSquareMeter); 
    const screwCost = totalScrews * screwPrice;

    // Блок расчёта одной ячейки
    const sectionSizeWidth = (width / (numPipesWidth - 1)).toFixed(4);
    const sectionSizeLength = (length / (numPipesLength - 1)).toFixed(4);
  
    // Блок: Подсчёт итоговой стоимости всех материалов
    const totalCost = sheetCost + pipeCost + screwCost;
  
    // Блок: Отображение результатов расчёта на странице
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
                  <h3>Результаты расчёта:</h3>
                  <table>
                      <tr>
                          <th>Наименование</th>
                          <th>ед.</th>
                          <th>кол-во</th>
                          <th>сумма</th>
                      </tr>
                      <tr>
                          <td>${material.name}</td>
                          <td>${material.unit}</td>
                          <td>${totalArea}<br>Минимальное кол-во листов ${numberOfSheets}шт</td>
                          <td>${sheetCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                          <td>${pipe.name}</td>
                          <td>${pipe.unit}</td>
                          <td>${totalPipeLength.toFixed(2)}</td>
                          <td>${pipeCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                          <td>${screwData.name}</td>
                          <td>${screwData.unit}</td>
                          <td>${totalScrews}</td>
                          <td>${screwCost.toFixed(2)}</td>
                      </tr>
                  </table>
                  <p class="section-siza">Площадь каркаса: ${totalArea} м2</p>
                  <p class="section-siza">Размер ячейки: ${sectionSizeWidth}м x ${sectionSizeLength}м</p>
                  <p class="total-font"><strong>Итого:</strong> ${totalCost.toFixed(2)} руб.</p>
              `;
  }
  