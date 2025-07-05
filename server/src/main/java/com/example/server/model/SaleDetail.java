package com.example.server.model;

public class SaleDetail {
    private String product;
    private int quantity;
    private double price;
    private double revenue;

    public SaleDetail(String product, int quantity, double price) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.revenue = quantity * price;
    }

    // Getters
    public String getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
    public double getRevenue() { return revenue; }
}
