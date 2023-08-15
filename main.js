let selectedFile;
document.getElementById("upload_file").addEventListener(
  "change",
  (event) => {
    selectedFile = event.target.files[0];
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
        const data_without_first_two_rows = data.slice(2);
        //column names start with the row 3 in the csv file -- at the moment column_names is not used
        const column_names = data[2];
        // indexes of the columns that need to be presented
        const requiredColumns = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14];


        //table
        const table = document.getElementById("loaded_csv_data_table");
        // create the table using the data slice
        // print out only the data that is included in the requiredColumns -- includes index
        data_without_first_two_rows.forEach((row) => {
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
