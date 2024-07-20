import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { Customer } from '../model/customer.model';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  isEditFormVisible: boolean = false;
  customers!: Customer[];
  editCustomerForm: FormGroup;
  currentCustomerId: any;
  errormessage!: string[];
  succesmessage!: string;
  isDeleteFormVisible: boolean = false;
  addCustomerForm: FormGroup;
  errormessageAddCustomer!: string[];
  succesmessageAddCustomer!: string;

  constructor(private customerService: CustomerService, private fb: FormBuilder,public auth:AuthService) {
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
    this.errormessage = [];
    this.succesmessage = "";
    this.errormessageAddCustomer = [];
    this.succesmessageAddCustomer = "";
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data;
        console.log(this.customers);
      }, error => {
        console.log("error occurs when loading customers: " + error);
      }
    );
  }

  updateCustomer() {
    this.errormessage = [];
    this.succesmessage = "";
    if (this.editCustomerForm.valid) {
      const updatedCustomer = {
        id: this.currentCustomerId,
        ...this.editCustomerForm.value
      };

      this.customerService.updateCustomer(updatedCustomer).subscribe(
        response => {
          this.loadCustomers();
          this.succesmessage = "Customer updated successfully.";
        },
        error => {
          this.errormessage.push("error updating the customer");
        }
      );
    } else {
      if (!this.editCustomerForm.get('name')?.valid) {
        this.errormessage.push("name is not valid");
      }
      if (!this.editCustomerForm.get('email')?.valid) {
        this.errormessage.push("email is not valid");
      }
    }
  }

  editCustomer(customer: any) {
    this.isEditFormVisible = true;
    this.currentCustomerId = customer.id;
    this.editCustomerForm.setValue({
      name: customer.name,
      email: customer.email
    });
    console.log(this.editCustomerForm);
  }

  closeEditForm() {
    this.isEditFormVisible = false;
  }

  closeDeleteForm() {
    this.isDeleteFormVisible = false;
  }

  deleteCustomerForm(customer: Customer) {
    this.isDeleteFormVisible = true;
    this.currentCustomerId = customer.id;
  }

  deleteCustomer() {
    this.succesmessage = "";
    this.errormessage = [];
    this.customerService.deleteCustomer(this.currentCustomerId).subscribe(
      () => {
        this.succesmessage = "Customer is deleted successfully";
        this.loadCustomers();
      },
      error => {
        this.errormessage.push("Customer is not found");
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
      this.customerService.addCustomer(customer).subscribe(
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
