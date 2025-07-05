# 📊 CSV Sales Data Uploader & Dynamic Summary Dashboard

A full-stack web application that allows users to upload CSV files containing fictional sales data. The backend (built with **Spring Boot**) processes the uploaded file to calculate summary metrics and stores them in an **in-memory database**. The frontend (built with **React**) displays a dynamic dashboard listing all uploaded summaries for the current server session.

---

## 🚀 Features

### ✅ Backend (Spring Boot)

* **POST \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*`/api/upload-sales-data`**: Accepts CSV file uploads, parses them dynamically based on headers, and calculates:

  * Total records
  * Total quantity
  * Total revenue
  * Per-row sale details (product, quantity, price, revenue)
* **GET \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*`/api/sales-summaries`**: Returns a list of all processed summaries from memory.
* In-memory storage — volatile, resets on server restart.
* Dynamic column header detection (CSV can be in any order).
* CORS enabled for development (`localhost:5173`).

### ✅ Frontend (React)

* File upload form with CSV validation
* Upload success/error notifications
* Dashboard table showing:

  * Upload ID
  * Upload timestamp
  * Total revenue
* Optional modal or expandable row to show full details per summary

---

## 📂 Folder Structure

```
spring-boot-csv-app/
├── controller/
│   └── SalesUploadController.java
├── model/
│   ├── SalesSummary.java
│   └── SaleDetail.java
├── service/
│   └── SalesDataService.java
├── config/
│   └── WebConfig.java
├── SpringBootCsvAppApplication.java
├── resources/
│   └── application.properties
├── pom.xml
```

---

## ⚙️ Tech Stack

| Layer       | Technology         |
| ----------- | ------------------ |
| Backend     | Java + Spring Boot |
| Build Tool  | Maven              |
| Frontend    | React              |


---

## 🛠️ Setup Instructions

### Backend (Spring Boot)

1. **Install JDK 17+ and Maven**
2. Clone the project:

   ```bash
   git clone https://github.com/Bidyut-Kr-Das/Assignment-spring-boot.git
   cd Assignment-spring-boot
   ```
3. Build the project:

   ```bash
   cd server
   mvn clean install
   
   ```

Backend runs at: `http://localhost:9090`

\##Frontend (React)

1. Install dependencies:

   ```bash
   cd ..
   npm install
   ```

2. Frontend runs at: `http://localhost:5173`

Start both frontend and backend servers:

```bash
npm run dev
```

---

## Sample CSV Format

```csv
product_name,quantity,price_per_unit
Laptop,2,1200.00
Mouse,5,25.50
Keyboard,1,75.00
```

> Column order can vary as long as headers are named properly.

---

## Known Limitations

* Data is stored only in memory (cleared on restart)
* No user authentication
* Basic CSV validation only (expects `product_name`, `quantity`, `price_per_unit` columns)
* Only `.csv` files are supported (no `.xlsx` yet)


##  Author

* Name: \[Your Name]
* GitHub: \[github.com/your-handle]
* Company: Innotek Solution (Internship Project)
