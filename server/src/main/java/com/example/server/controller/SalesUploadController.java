package com.example.server.controller;

import com.example.server.model.SaleDetail;
import com.example.server.model.SalesSummary;
import com.example.server.service.SalesDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SalesUploadController {

    @Autowired
    private SalesDataService salesDataService;

    @PostMapping("/upload-sales-data")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        int totalRecords = 0;
        int totalQuantity = 0;
        double totalRevenue = 0;
        List<SaleDetail> details = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            Map<String, Integer> headerIndexMap = new HashMap<>();

            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                String[] cols = line.split(",");

                if (isHeader) {
                    for (int i = 0; i < cols.length; i++) {
                        headerIndexMap.put(cols[i].trim().toLowerCase(), i);
                    }

                    
                    if (!headerIndexMap.containsKey("product_name") ||
                            !headerIndexMap.containsKey("quantity") ||
                            !headerIndexMap.containsKey("price_per_unit")) {
                        return ResponseEntity.badRequest().body("Missing required headers: product, quantity, price");
                    }

                    isHeader = false;
                    continue;
                }

                String product = cols[headerIndexMap.get("product_name")].trim();
                int quantity = Integer.parseInt(cols[headerIndexMap.get("quantity")].trim());
                double price = Double.parseDouble(cols[headerIndexMap.get("price_per_unit")].trim());

                details.add(new SaleDetail(product, quantity, price));

                totalRecords++;
                totalQuantity += quantity;
                totalRevenue += quantity * price;
            }

            SalesSummary summary = new SalesSummary(
                    totalRecords,
                    totalQuantity,
                    totalRevenue,
                    file.getOriginalFilename(),
                    details);

            salesDataService.addSummary(summary);
            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("CSV parsing failed: " + e.getMessage());
        }
    }

    @GetMapping("/sales-summaries")
    public ResponseEntity<List<SalesSummary>> getAllSummaries() {
        return ResponseEntity.ok(salesDataService.getAllSummaries());
    }
}
