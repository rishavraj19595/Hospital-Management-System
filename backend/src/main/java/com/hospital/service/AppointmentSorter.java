package com.hospital.service;

import com.hospital.model.Appointment;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom Merge Sort implementation for sorting appointments based on different parameters.
 */
public class AppointmentSorter {

    public static List<Appointment> sort(List<Appointment> list, String parameter) {
        if (list == null || list.size() <= 1) {
            return list;
        }
        
        List<Appointment> mutableList = new ArrayList<>(list);
        mergeSort(mutableList, 0, mutableList.size() - 1, parameter);
        return mutableList;
    }

    private static void mergeSort(List<Appointment> list, int left, int right, String param) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(list, left, mid, param);
            mergeSort(list, mid + 1, right, param);
            merge(list, left, mid, right, param);
        }
    }

    private static void merge(List<Appointment> list, int left, int mid, int right, String param) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        List<Appointment> L = new ArrayList<>(n1);
        List<Appointment> R = new ArrayList<>(n2);

        for (int i = 0; i < n1; ++i) L.add(list.get(left + i));
        for (int j = 0; j < n2; ++j) R.add(list.get(mid + 1 + j));

        int i = 0, j = 0;
        int k = left;

        while (i < n1 && j < n2) {
            if (compare(L.get(i), R.get(j), param) <= 0) {
                list.set(k, L.get(i));
                i++;
            } else {
                list.set(k, R.get(j));
                j++;
            }
            k++;
        }

        while (i < n1) {
            list.set(k, L.get(i));
            i++;
            k++;
        }

        while (j < n2) {
            list.set(k, R.get(j));
            j++;
            k++;
        }
    }

    private static int compare(Appointment a, Appointment b, String param) {
        if ("name".equalsIgnoreCase(param)) {
            String nameA = (a.getFname() + " " + a.getLname()).toLowerCase();
            String nameB = (b.getFname() + " " + b.getLname()).toLowerCase();
            return nameA.compareTo(nameB);
        } else if ("fees".equalsIgnoreCase(param)) {
            return Integer.compare(a.getDocFees(), b.getDocFees());
        } else { // default to date/time comparison
            if (a.isEmergency() && !b.isEmergency()) {
                return -1;
            } else if (!a.isEmergency() && b.isEmergency()) {
                return 1;
            }
            String dtA = a.getAppdate() + "T" + a.getApptime();
            String dtB = b.getAppdate() + "T" + b.getApptime();
            return dtA.compareTo(dtB);
        }
    }
}
