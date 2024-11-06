// Функция для расчёта материалов, затрат и отображения результатов
export function calculateMaterials(data, config) {

    // Блок: Получение значений ширины, длины и выбранных материалов из формы
    const width = parseFloat(document.getElementById("width").value);
    const length = parseFloat(document.getElementById("length").value);
    const selectedMaterial = document.getElementById("material").value;
    const selectedPipeType = document.getElementById("pipeType").value;
    const selectedStrength = document.getElementById("strength").value;

    // Блок: Проверка корректности введённых размеров
    if (isNaN(width) || isNaN(length) || width < 5 || length > 25 || length < 5 || length > 50) {
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
    const sheetArea = sheetWidth * 1; // Площадь одного листа материала
    const totalArea = width * length;
    const numberOfSheets = Math.ceil(totalArea / sheetArea);
    const sheetCost = numberOfSheets * material.price;

    // Блок: Расчёт длины и стоимости труб для каркаса
    const maxStep = frameConfig.step;
    const pipeWidth = pipe.width / 1000;
    const pipeWidthAndMaxStep = maxStep + pipeWidth;
    const difPipeAndWidth = width - pipeWidth;
    const difPipeAndLength = length - pipeWidth;

    // Вычисление количества труб по ширине и длине
    const numPipesWidth = Math.ceil(difPipeAndWidth / pipeWidthAndMaxStep) + 1;
    const numPipesLength = Math.ceil(difPipeAndLength / pipeWidthAndMaxStep) + 1;
    const totalPipeLength = numPipesWidth * length + numPipesLength * width;
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

    // Очищаем старые результаты в таблице и полях
    const tableBody = document.getElementById("resultTableBody");
    tableBody.innerHTML = ""; // Очищаем таблицу перед добавлением новых строк

    // Данные для добавления в таблицу
    const rowsData = [
        {
            name: material.name,
            unit: material.unit,
            quantity: `${totalArea} м² (Минимум ${numberOfSheets} шт)`,
            cost: sheetCost.toFixed(2),
        },
        {
            name: pipe.name,
            unit: pipe.unit,
            quantity: totalPipeLength.toFixed(2),
            cost: pipeCost.toFixed(2),
        },
        {
            name: screwData.name,
            unit: screwData.unit,
            quantity: totalScrews,
            cost: screwCost.toFixed(2),
        },
    ];

    // Добавляем строки в таблицу
    rowsData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.unit}</td>
            <td>${row.quantity}</td>
            <td>${row.cost}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Отображение итоговой информации
    document.getElementById("totalArea").textContent = `Площадь каркаса: ${totalArea} м²`;
    document.getElementById("sectionSize").textContent = `Размер ячейки: ${sectionSizeWidth} м x ${sectionSizeLength} м`;
    document.getElementById("totalCost").textContent = `Итого: ${totalCost.toFixed(2)} руб.`;
}
