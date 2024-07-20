import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Customer {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/customers';

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.baseUrl);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.baseUrl}/${customer.id}`, customer);
  }

  deleteCustomer(customerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${customerId}`);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.baseUrl, customer);
  }
}
