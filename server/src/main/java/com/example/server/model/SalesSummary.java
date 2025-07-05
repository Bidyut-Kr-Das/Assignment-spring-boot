package com.example.server.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


public class SalesSummary {
    private String id;
    private LocalDateTime timestamp;
    private int totalRecords;
    private int totalQuantity;
    private double totalRevenue;
    private String fileName;
    private List<SaleDetail> details;

    public SalesSummary(int totalRecords, int totalQuantity, double totalRevenue, String fileName, List<SaleDetail> details) {
        this.id = UUID.randomUUID().toString();
        this.timestamp = LocalDateTime.now();
        this.totalRecords = totalRecords;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
        this.fileName = fileName;
        this.details = details;
    }

    // Getters
    public String getId() { return id; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public int getTotalRecords() { return totalRecords; }
    public int getTotalQuantity() { return totalQuantity; }
    public double getTotalRevenue() { return totalRevenue; }
    public String getFileName() { return fileName; }
    public List<SaleDetail> getDetails() { return details; }
}
