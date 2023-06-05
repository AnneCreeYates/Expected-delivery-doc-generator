let selectedFile;
const upload = document.getElementById("upload_file").addEventListener(
  "change",
  (evnt) => {
    selectedFile = evnt.target.files[0];
  },
  false
);

document.getElementById("upload-file_button").addEventListener(
  "click",
  () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (event) => {
        const csv = event.target.result;
        const data = csv.split("\n").map((row) => row.split(","));
        //table
        const table = document.getElementById("loaded_csv_data_table");
        data.forEach((row) => {
          const table_row = document.createElement("tr");
          row.forEach((content) => {
            const table_data = document.createElement("td");
            table_data.textContent = content;
            table_row.appendChild(table_data);
          });
          table.appendChild(table_row);
        });
      };
    }
  },
  false
);
