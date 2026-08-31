package com.hospital.service;

import com.hospital.model.Patient;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom Binary Search utility to search patients by contact number.
 */
public class PatientSearcher {

    /**
     * Search patient in a list by contact number.
     * Uses custom sorting (insertion sort) and then Binary Search.
     */
    public static Patient searchByContact(List<Patient> patients, String contact) {
        if (patients == null || patients.isEmpty() || contact == null) {
            return null;
        }

        List<Patient> sortedPatients = new ArrayList<>(patients);
        sortByContact(sortedPatients);

        int low = 0;
        int high = sortedPatients.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            Patient midVal = sortedPatients.get(mid);
            int cmp = midVal.getContact().compareTo(contact);

            if (cmp < 0) {
                low = mid + 1;
            } else if (cmp > 0) {
                high = mid - 1;
            } else {
                return midVal; // Patient found
            }
        }

        return null; // Patient not found
    }

    /**
     * Helper to sort patients list by contact number (Insertion Sort)
     */
    private static void sortByContact(List<Patient> list) {
        int n = list.size();
        for (int i = 1; i < n; ++i) {
            Patient key = list.get(i);
            int j = i - 1;

            while (j >= 0 && list.get(j).getContact().compareTo(key.getContact()) > 0) {
                list.set(j + 1, list.get(j));
                j = j - 1;
            }
            list.set(j + 1, key);
        }
    }
}
