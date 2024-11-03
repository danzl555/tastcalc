// Функция для загрузки данных с указанного URL (асинхронный запрос)
// Возвращает данные в формате JSON
export async function loadData(url) {
  const response = await fetch(url); 
  return await response.json(); 
}

// Функция для одновременной загрузки данных и конфигурации
// Загружает data.json и config.json параллельно и возвращает их вместе
export async function loadFormData() {
  const [data, config] = await Promise.all([
      loadData("/data/data.json"),
      loadData("/data/config.json"),
  ]);
  return { data, config }; 
}
