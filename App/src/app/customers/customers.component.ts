import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Customer{
  id:string;
  name:string;
  email:string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  isEditFormVisible: boolean=false;
  customers!:Customer[];
  editCustomerForm: FormGroup;
  currentCustomerId:any;
  errormessage!: string[];
  succesmessage!: string;
  isDeleteFormVisible: boolean=false;
  addCustomerForm: FormGroup;
  errormessageAddCustomer!: string[];
  succesmessageAddCustomer!: string;
  
  constructor(private httpClient:HttpClient, private fb: FormBuilder){
    this.editCustomerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.addCustomerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
 
  ngOnInit(): void {
    this.loadCustomers();
    this.errormessage=[];
    this.succesmessage="";
    this.errormessageAddCustomer=[];
    this.succesmessageAddCustomer="";
  }

  loadCustomers(){
    this.httpClient.get<Customer[]>("http://localhost:8080/customers").subscribe(
      data=>{
        this.customers=data;
        console.log(this.customers);
      },error=>{
        console.log("error occurs when loading cutomers"+error);
      }
    );  
  }

  updateCustomer() {
    this.errormessage=[];
    this.succesmessage="";
    if (this.editCustomerForm.valid) {
      const updatedCustomer = {
        id: this.currentCustomerId,
        ...this.editCustomerForm.value
      };

      this.httpClient.put(`http://localhost:8080/customers/${this.currentCustomerId}`, updatedCustomer).subscribe(
        response => {
          this.loadCustomers();
          this.succesmessage= "Customer updated successfully.";
        },
        error => {
          this.errormessage.push("error updating the customer");
        }
      );
    }else{
     if(!this.editCustomerForm.get('name')?.valid){
      this.errormessage.push("name is not valid");
     }
     if(!this.editCustomerForm.get('email')?.valid){
      this.errormessage.push("email is not valid");
     }
    }
  }
  editCustomer(customer: any) {
    this.isEditFormVisible=true;
    this.currentCustomerId = customer.id;
    this.editCustomerForm.setValue({
      name: customer.name,
      email: customer.email
    });
    console.log(this.editCustomerForm);
  }
  closeEditForm() {
    this.isEditFormVisible=false;
  }
    
  closeDeleteForm() {
    this.isDeleteFormVisible=false;
  }
  deleteCustomerForm(customer: Customer) {
    this.isDeleteFormVisible=true;
    this.currentCustomerId=customer.id;
  }  
  deleteCustomer(){
    this.succesmessage="";
    this.errormessage=[];
    this.httpClient.delete(`http://localhost:8080/customers/${this.currentCustomerId}`).subscribe(
      ()=>{
        this.succesmessage="Customer is deleted Succesfully";
        this.loadCustomers();
      },
      error=>{
        this.errormessage.push("Customer is Not found");
      }
    );
  }
  addCustomer() {
    this.succesmessageAddCustomer = "";
    this.errormessageAddCustomer = [];
    if (this.addCustomerForm.valid) {
      const customer = {
        ...this.addCustomerForm.value
      }
      this.httpClient.post<Customer>(`http://localhost:8080/customers`, customer).subscribe(
        () => {
          this.loadCustomers();
          this.succesmessageAddCustomer = "Customer is added successfully";
          this.clearMessagesAfterTimeout();
        }, error => {
          this.errormessageAddCustomer.push("Failed to add a customer");
          this.clearMessagesAfterTimeout();
        }
      );
    } else {
      if (!this.addCustomerForm.get('name')?.valid) {
        this.errormessageAddCustomer.push("Name is not valid");
      }
      if (!this.addCustomerForm.get('email')?.valid) {
        this.errormessageAddCustomer.push("Email is not valid");
      }
      this.clearMessagesAfterTimeout();
    }
    this.succesmessage = "";
    this.errormessage = [];
  }

  clearMessagesAfterTimeout() {
    setTimeout(() => {
      this.succesmessage = "";
      this.errormessage = [];
      this.succesmessageAddCustomer = "";
      this.errormessageAddCustomer = [];
    }, 2000);
  }
}
