import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Runner {

    static Scanner sc = new Scanner(System.in);
    static List<User> users = new ArrayList<>();
    static Bank bank = new Bank(1, "ABC Digital Bank");

    static {
        Admin admin = new Admin("admin", "admin123");
        users.add(admin);
    }

    public static void main(String[] args) {

        printMessage("================================");
        printMessage("Welcome to " + bank.getName());
        printMessage("================================");

        boolean running = true;

        while (running) {

            User loggedInUser = login();

            if (loggedInUser == null) {
                System.out.println("Invalid username or password.");
            } else if (loggedInUser.getUserType().equals("admin")) {
                adminDashboard();
            } else {
                customerDashboard((Customer) loggedInUser);
            }

            System.out.println("\nReturn to the login screen?");
            System.out.print("Enter y for yes or n for no: ");

            String response = sc.nextLine();

            if (response.equalsIgnoreCase("n")) {
                running = false;
            }
        }

        System.out.println(
                "\nThank you for using " + bank.getName() + "."
        );

        sc.close();
    }

    // --------------------------------------------------
    // LOGIN
    // --------------------------------------------------

    static User login() {

        System.out.println("\nLogin");

        System.out.print("Enter username: ");
        String enteredUsername = readRequiredString();

        System.out.print("Enter password: ");
        String enteredPassword = readRequiredString();

        for (User user : users) {

            boolean usernameMatches =
                    enteredUsername.equals(user.getUsername());

            boolean passwordMatches =
                    enteredPassword.equals(user.getPassword());

            if (usernameMatches && passwordMatches) {
                return user;
            }
        }

        return null;
    }

    // --------------------------------------------------
    // ADMIN DASHBOARD
    // --------------------------------------------------

    static void adminDashboard() {

        boolean adminLoggedIn = true;

        while (adminLoggedIn) {

            System.out.println("\nAdministrator Dashboard");
            System.out.println("1. Create Customer");
            System.out.println("2. Create/Edit Account");
            System.out.println("3. View All Customers");
            System.out.println("4. View All Accounts");
            System.out.println("5. Log out");
            System.out.print("Choose an option: ");

            int choice = readInt();

            switch (choice) {

                case 1:
                    createCustomer();
                    break;

                case 2:
                    createAccount();
                    break;

                case 3:
                    displayCustomers();
                    break;

                case 4:
                    bank.displayAllAccounts();
                    break;

                case 5:
                    adminLoggedIn = false;
                    System.out.println("Administrator logged out.");
                    break;

                default:
                    System.out.println(
                            "Invalid administrator option."
                    );
            }
        }
    }

    static void createCustomer() {

        System.out.println("\nCreate Customer");

        System.out.print("Enter customer's full name: ");
        String fullName = readRequiredString();

        System.out.print("Create a username: ");
        String username = readRequiredString();

        if (usernameExists(username)) {
            System.out.println("That username already exists.");
            return;
        }

        System.out.print("Create a password: ");
        String password = readRequiredString();

        int customerId = bank.generateCustomerId();

        Customer customer = new Customer(
                customerId,
                fullName,
                username,
                password
        );

        users.add(customer);
        bank.addCustomer(customer);

        System.out.println("\nCustomer created successfully.");
        System.out.println("Customer ID: " + customerId);
        System.out.println("Customer name: " + fullName);
        System.out.println("Username: " + username);
    }

    static void createAccount() {

        if (!bank.hasCustomers()) {
            System.out.println(
                    "\nCreate a customer before creating an account."
            );
            return;
        }

        displayCustomers();

        System.out.print("\nEnter customer ID: ");
        int customerId = readInt();

        Customer customer =
                bank.findCustomerById(customerId);

        if (customer == null) {
            System.out.println("Customer not found.");
            return;
        }

        System.out.println("\nChoose account type");
        System.out.println("1. Checking account");
        System.out.println("2. Savings account");
        System.out.print("Enter your choice: ");

        int accountChoice = readInt();

        System.out.print("Enter starting balance: $");
        double startingBalance = readNonNegativeDouble();

        Account account;

        if (accountChoice == 1) {

            account = new CheckingAccount(
                    bank.generateAccountId(),
                    startingBalance
            );

        } else if (accountChoice == 2) {

            account = new SavingsAccount(
                    bank.generateAccountId(),
                    startingBalance
            );

        } else {

            System.out.println("Invalid account type.");
            return;
        }

        customer.addAccount(account);

        if (startingBalance > 0) {
            account.recordStartingBalance(startingBalance);
        }

        System.out.println("\nAccount created successfully.");
        System.out.println("Owner: " + customer.getFullName());
        System.out.println(
                "Account ID: " + account.getAccountId()
        );
        System.out.println(
                "Account type: " + account.getAccountType()
        );
        System.out.printf(
                "Starting balance: $%.2f%n",
                account.getBalance()
        );
    }

    static void displayCustomers() {

        List<Customer> customers =
                bank.getCustomers();

        System.out.println("\nCustomers");

        if (customers.isEmpty()) {
            System.out.println(
                    "No customers have been created."
            );
            return;
        }

        for (Customer customer : customers) {
            System.out.println(customer);
        }
    }

    static boolean usernameExists(String username) {

        for (User user : users) {

            if (user.getUsername().equalsIgnoreCase(username)) {
                return true;
            }
        }

        return false;
    }

    // --------------------------------------------------
    // CUSTOMER DASHBOARD
    // --------------------------------------------------

    static void customerDashboard(Customer customer) {

        boolean customerLoggedIn = true;

        System.out.println(
                "\nWelcome, " + customer.getFullName() + "."
        );

        while (customerLoggedIn) {

            System.out.println("\nCustomer Dashboard");
            System.out.println("1. View my accounts");
            System.out.println("2. Deposit money");
            System.out.println("3. Withdraw money");
            System.out.println("4. Transfer money");
            System.out.println("5. View transaction history");
            System.out.println("6. Log out");
            System.out.print("Choose an option: ");

            int choice = readInt();

            switch (choice) {

                case 1:
                    customer.displayAccounts();
                    break;

                case 2:
                    deposit(customer);
                    break;

                case 3:
                    withdraw(customer);
                    break;

                case 4:
                    transfer(customer);
                    break;

                case 5:
                    viewTransactions(customer);
                    break;

                case 6:
                    customerLoggedIn = false;
                    System.out.println("Customer logged out.");
                    break;

                default:
                    System.out.println(
                            "Invalid customer option."
                    );
            }
        }
    }

    static void deposit(Customer customer) {

        if (!customer.hasAccounts()) {
            System.out.println(
                    "\nYou do not have any bank accounts."
            );
            return;
        }

        customer.displayAccounts();

        System.out.print("\nEnter account ID: ");
        int accountId = readInt();

        Account account =
                customer.findAccountById(accountId);

        if (account == null) {
            System.out.println(
                    "That account does not belong to you."
            );
            return;
        }

        System.out.print("Enter deposit amount: $");
        double amount = readPositiveDouble();

        account.deposit(amount);
    }

    static void withdraw(Customer customer) {

        if (!customer.hasAccounts()) {
            System.out.println(
                    "\nYou do not have any bank accounts."
            );
            return;
        }

        customer.displayAccounts();

        System.out.print("\nEnter account ID: ");
        int accountId = readInt();

        Account account =
                customer.findAccountById(accountId);

        if (account == null) {
            System.out.println(
                    "That account does not belong to you."
            );
            return;
        }

        System.out.print("Enter withdrawal amount: $");
        double amount = readPositiveDouble();

        account.withdraw(amount);
    }

    static void transfer(Customer customer) {

        if (!customer.hasAccounts()) {
            System.out.println(
                    "\nYou do not have any bank accounts."
            );
            return;
        }

        if (bank.getAccountCount() < 2) {
            System.out.println(
                    "\nAt least two accounts must exist "
                            + "before a transfer can be made."
            );
            return;
        }

        customer.displayAccounts();

        System.out.print("\nEnter source account ID: ");
        int sourceId = readInt();

        Account sourceAccount =
                customer.findAccountById(sourceId);

        if (sourceAccount == null) {
            System.out.println(
                    "That source account does not belong to you."
            );
            return;
        }

        System.out.print("Enter destination account ID: ");
        int destinationId = readInt();

        Account destinationAccount =
                bank.findAccountById(destinationId);

        if (destinationAccount == null) {
            System.out.println(
                    "Destination account was not found."
            );
            return;
        }

        System.out.print("Enter transfer amount: $");
        double amount = readPositiveDouble();

        sourceAccount.transfer(
                destinationAccount,
                amount
        );
    }

    static void viewTransactions(Customer customer) {

        if (!customer.hasAccounts()) {
            System.out.println(
                    "\nYou do not have any bank accounts."
            );
            return;
        }

        customer.displayAccounts();

        System.out.print(
                "\nEnter account ID to view transactions: "
        );

        int accountId = readInt();

        Account account =
                customer.findAccountById(accountId);

        if (account == null) {
            System.out.println(
                    "That account does not belong to you."
            );
            return;
        }

        account.displayTransactions();
    }

    // --------------------------------------------------
    // INPUT METHODS
    // --------------------------------------------------

    static int readInt() {

        while (!sc.hasNextInt()) {

            System.out.print(
                    "Please enter a whole number: "
            );

            sc.nextLine();
        }

        int number = sc.nextInt();
        sc.nextLine();

        return number;
    }

    static double readDouble() {

        while (!sc.hasNextDouble()) {

            System.out.print(
                    "Please enter a valid number: "
            );

            sc.nextLine();
        }

        double number = sc.nextDouble();
        sc.nextLine();

        return number;
    }

    static double readPositiveDouble() {

        while (true) {

            double amount = readDouble();

            if (amount > 0) {
                return amount;
            }

            System.out.print(
                    "Amount must be greater than zero. Try again: $"
            );
        }
    }

    static double readNonNegativeDouble() {

        while (true) {

            double amount = readDouble();

            if (amount >= 0) {
                return amount;
            }

            System.out.print(
                    "Amount cannot be negative. Try again: $"
            );
        }
    }

    static String readRequiredString() {

        while (true) {

            String value = sc.nextLine().trim();

            if (!value.isEmpty()) {
                return value;
            }

            System.out.print(
                    "This field cannot be empty. Try again: "
            );
        }
    }

    static void printMessage(String message) {
        System.out.println(message);
    }
}

// --------------------------------------------------
// BANK
// --------------------------------------------------

class Bank {

    private int id;
    private String name;
    private List<Customer> customers;
    private int nextCustomerId;
    private int nextAccountId;

    public Bank(int id, String name) {

        this.id = id;
        this.name = name;
        this.customers = new ArrayList<>();
        this.nextCustomerId = 1;
        this.nextAccountId = 1001;
    }

    public int generateCustomerId() {

        int generatedId = nextCustomerId;
        nextCustomerId++;

        return generatedId;
    }

    public int generateAccountId() {

        int generatedId = nextAccountId;
        nextAccountId++;

        return generatedId;
    }

    public void addCustomer(Customer customer) {
        customers.add(customer);
    }

    public boolean hasCustomers() {
        return !customers.isEmpty();
    }

    public Customer findCustomerById(int customerId) {

        for (Customer customer : customers) {

            if (customer.getCustomerId() == customerId) {
                return customer;
            }
        }

        return null;
    }

    public Account findAccountById(int accountId) {

        for (Customer customer : customers) {

            Account account =
                    customer.findAccountById(accountId);

            if (account != null) {
                return account;
            }
        }

        return null;
    }

    public int getAccountCount() {

        int count = 0;

        for (Customer customer : customers) {
            count += customer.getAccounts().size();
        }

        return count;
    }

    public void displayAllAccounts() {

        System.out.println("\nAll Bank Accounts");

        if (getAccountCount() == 0) {
            System.out.println("No accounts have been created.");
            return;
        }

        for (Customer customer : customers) {

            for (Account account : customer.getAccounts()) {

                System.out.println(
                        "Owner: "
                                + customer.getFullName()
                                + " | "
                                + account
                );
            }
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(
            List<Customer> customers
    ) {
        this.customers = customers;
    }
}

// --------------------------------------------------
// USER
// --------------------------------------------------

abstract class User {

    private String username;
    private String password;

    public User(
            String username,
            String password
    ) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(
            String username
    ) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password = password;
    }

    abstract String getUserType();
}

class Admin extends User {

    public Admin(
            String username,
            String password
    ) {
        super(username, password);
    }

    @Override
    String getUserType() {
        return "admin";
    }
}

class Customer extends User {

    private int customerId;
    private String fullName;
    private List<Account> accounts;

    public Customer(
            int customerId,
            String fullName,
            String username,
            String password
    ) {
        super(username, password);

        this.customerId = customerId;
        this.fullName = fullName;
        this.accounts = new ArrayList<>();
    }

    public void addAccount(Account account) {
        accounts.add(account);
    }

    public boolean hasAccounts() {
        return !accounts.isEmpty();
    }

    public Account findAccountById(int accountId) {

        for (Account account : accounts) {

            if (account.getAccountId() == accountId) {
                return account;
            }
        }

        return null;
    }

    public void displayAccounts() {

        System.out.println(
                "\nAccounts for " + fullName
        );

        if (accounts.isEmpty()) {
            System.out.println("No accounts found.");
            return;
        }

        for (Account account : accounts) {
            System.out.println(account);
        }
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(
            int customerId
    ) {
        this.customerId = customerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(
            List<Account> accounts
    ) {
        this.accounts = accounts;
    }

    @Override
    String getUserType() {
        return "customer";
    }

    @Override
    public String toString() {

        return "Customer ID: "
                + customerId
                + " | Name: "
                + fullName
                + " | Username: "
                + getUsername()
                + " | Accounts: "
                + accounts.size();
    }
}

// --------------------------------------------------
// ACCOUNT
// --------------------------------------------------

abstract class Account implements AccountOperations {

    private int accountId;
    private double balance;
    private List<Transaction> transactions;

    public Account(
            int accountId,
            double balance
    ) {
        this.accountId = accountId;
        this.balance = balance;
        this.transactions = new ArrayList<>();
    }

    @Override
    public void deposit(double amount) {

        if (amount <= 0) {
            System.out.println(
                    "Deposit amount must be greater than zero."
            );
            return;
        }

        balance += amount;

        transactions.add(
                new Transaction(
                        "DEPOSIT",
                        amount,
                        balance
                )
        );

        System.out.printf(
                "Deposit successful. New balance: $%.2f%n",
                balance
        );
    }

    @Override
    public boolean withdraw(double amount) {

        if (amount <= 0) {
            System.out.println(
                    "Withdrawal amount must be greater than zero."
            );
            return false;
        }

        if (amount > balance) {
            System.out.println("Insufficient funds.");
            return false;
        }

        balance -= amount;

        transactions.add(
                new Transaction(
                        "WITHDRAWAL",
                        amount,
                        balance
                )
        );

        System.out.printf(
                "Withdrawal successful. New balance: $%.2f%n",
                balance
        );

        return true;
    }

    @Override
    public boolean transfer(
            Account destination,
            double amount
    ) {

        if (destination == null) {
            System.out.println(
                    "Destination account does not exist."
            );
            return false;
        }

        if (destination == this) {
            System.out.println(
                    "You cannot transfer to the same account."
            );
            return false;
        }

        if (amount <= 0) {
            System.out.println(
                    "Transfer amount must be greater than zero."
            );
            return false;
        }

        if (amount > balance) {
            System.out.println(
                    "Insufficient funds for this transfer."
            );
            return false;
        }

        balance -= amount;

        transactions.add(
                new Transaction(
                        "TRANSFER OUT TO "
                                + destination.getAccountId(),
                        amount,
                        balance
                )
        );

        destination.receiveTransfer(
                accountId,
                amount
        );

        System.out.println("Transfer successful.");

        System.out.printf(
                "New source balance: $%.2f%n",
                balance
        );

        return true;
    }

    private void receiveTransfer(
            int sourceAccountId,
            double amount
    ) {

        balance += amount;

        transactions.add(
                new Transaction(
                        "TRANSFER IN FROM "
                                + sourceAccountId,
                        amount,
                        balance
                )
        );
    }

    public void recordStartingBalance(
            double amount
    ) {

        transactions.add(
                new Transaction(
                        "OPENING DEPOSIT",
                        amount,
                        balance
                )
        );
    }

    public void displayTransactions() {

        System.out.println(
                "\nTransaction History for Account "
                        + accountId
        );

        if (transactions.isEmpty()) {
            System.out.println(
                    "No transactions were found."
            );
            return;
        }

        for (Transaction transaction : transactions) {
            System.out.println(transaction);
        }
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(
            int accountId
    ) {
        this.accountId = accountId;
    }

    public double getBalance() {
        return balance;
    }

    protected void setBalance(
            double balance
    ) {
        this.balance = balance;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    abstract String getAccountType();

    abstract double getInterestRate();

    @Override
    public String toString() {

        return String.format(
                "Account ID: %d | Type: %s | Balance: $%.2f | Interest: %.1f%%",
                accountId,
                getAccountType(),
                balance,
                getInterestRate()
        );
    }
}

// --------------------------------------------------
// CHECKING ACCOUNT
// --------------------------------------------------

class CheckingAccount extends Account {

    private static final double INTEREST_RATE = 1.0;

    public CheckingAccount(
            int accountId,
            double balance
    ) {
        super(accountId, balance);
    }

    @Override
    String getAccountType() {
        return "Checking";
    }

    @Override
    double getInterestRate() {
        return INTEREST_RATE;
    }
}

// --------------------------------------------------
// SAVINGS ACCOUNT
// --------------------------------------------------

class SavingsAccount extends Account {

    private static final double INTEREST_RATE = 2.0;

    public SavingsAccount(
            int accountId,
            double balance
    ) {
        super(accountId, balance);
    }

    @Override
    String getAccountType() {
        return "Savings";
    }

    @Override
    double getInterestRate() {
        return INTEREST_RATE;
    }
}

// --------------------------------------------------
// ACCOUNT OPERATIONS
// --------------------------------------------------

interface AccountOperations {

    void deposit(double amount);

    boolean withdraw(double amount);

    boolean transfer(
            Account destination,
            double amount
    );
}

// --------------------------------------------------
// TRANSACTION
// --------------------------------------------------

class Transaction {

    private static int nextTransactionId = 1;

    private int transactionId;
    private String transactionType;
    private double amount;
    private double balanceAfterTransaction;
    private LocalDateTime dateTime;

    public Transaction(
            String transactionType,
            double amount,
            double balanceAfterTransaction
    ) {
        this.transactionId = nextTransactionId;
        nextTransactionId++;

        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceAfterTransaction =
                balanceAfterTransaction;

        this.dateTime = LocalDateTime.now();
    }

    @Override
    public String toString() {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "MM/dd/yyyy hh:mm a"
                );

        return String.format(
                "Transaction ID: %d | %-22s | Amount: $%.2f | Balance: $%.2f | Date: %s",
                transactionId,
                transactionType,
                amount,
                balanceAfterTransaction,
                dateTime.format(formatter)
        );
    }
}
