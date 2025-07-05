package com.example.server.service;

import com.example.server.model.SalesSummary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SalesDataService {

    private final List<SalesSummary> summaryList = new ArrayList<>();

    public void addSummary(SalesSummary summary) {
        summaryList.add(summary);
    }

    public List<SalesSummary> getAllSummaries() {
        return summaryList;
    }
}
