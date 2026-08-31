package com.hospital.service;

import com.hospital.model.Appointment;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom Min-Heap Implementation for Appointment Queueing.
 * Sorts appointments chronologically by date and time.
 */
public class AppointmentQueue {
    private List<Appointment> heap;

    public AppointmentQueue() {
        this.heap = new ArrayList<>();
    }

    public void insert(Appointment app) {
        heap.add(app);
        siftUp(heap.size() - 1);
    }

    public Appointment poll() {
        if (heap.isEmpty()) return null;
        Appointment min = heap.get(0);
        int lastIndex = heap.size() - 1;
        if (lastIndex > 0) {
            heap.set(0, heap.get(lastIndex));
            heap.remove(lastIndex);
            siftDown(0);
        } else {
            heap.remove(0);
        }
        return min;
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public int size() {
        return heap.size();
    }

    private void siftUp(int index) {
        while (index > 0) {
            int parentIndex = (index - 1) / 2;
            if (compare(heap.get(index), heap.get(parentIndex)) < 0) {
                swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    private void siftDown(int index) {
        int size = heap.size();
        while (2 * index + 1 < size) {
            int leftChild = 2 * index + 1;
            int rightChild = leftChild + 1;
            int smallest = leftChild;

            if (rightChild < size && compare(heap.get(rightChild), heap.get(leftChild)) < 0) {
                smallest = rightChild;
            }

            if (compare(heap.get(smallest), heap.get(index)) < 0) {
                swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    private int compare(Appointment a, Appointment b) {
        if (a.isEmergency() && !b.isEmergency()) {
            return -1;
        } else if (!a.isEmergency() && b.isEmergency()) {
            return 1;
        }
        
        // Construct ISO-like date-time strings for comparison
        String dtA = a.getAppdate() + "T" + a.getApptime();
        String dtB = b.getAppdate() + "T" + b.getApptime();
        return dtA.compareTo(dtB);
    }

    private void swap(int i, int j) {
        Appointment temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    public List<Appointment> toSortedList() {
        List<Appointment> sorted = new ArrayList<>();
        // Make a copy of heap to not empty the queue
        AppointmentQueue copy = new AppointmentQueue();
        for (Appointment app : this.heap) {
            copy.insert(app);
        }
        while (!copy.isEmpty()) {
            sorted.add(copy.poll());
        }
        return sorted;
    }
}
