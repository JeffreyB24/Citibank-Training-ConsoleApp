import { useEffect, useState } from "react";
import bankApi from "../../api/bankApi";

function TransactionsPage() {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [selectedAccount, setSelectedAccount] = useState("");

    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const [transfer, setTransfer] = useState({
        fromAccountId: "",
        toAccountId: "",
        amount: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAccounts();
    }, []);

    async function loadAccounts() {
        const response = await bankApi.get("/accounts");
        setAccounts(response.data);
    }

    async function loadTransactions(accountId) {
        if (!accountId) {
            setTransactions([]);
            return;
        }

        const response = await bankApi.get(
            `/accounts/${accountId}/transactions`
        );

        setTransactions(response.data);
    }

    async function deposit() {
        if (!selectedAccount || !depositAmount) return;

        try {
            await bankApi.post(
                `/accounts/${selectedAccount}/deposit`,
                {
                    amount: Number(depositAmount)
                }
            );

            setMessage("Deposit successful.");

            setDepositAmount("");

            loadAccounts();
            loadTransactions(selectedAccount);

        } catch (error) {
            console.error(error);
            setMessage("Deposit failed.");
        }
    }

    async function withdraw() {
        if (!selectedAccount || !withdrawAmount) return;

        try {

            await bankApi.post(
                `/accounts/${selectedAccount}/withdraw`,
                {
                    amount: Number(withdrawAmount)
                }
            );

            setMessage("Withdrawal successful.");

            setWithdrawAmount("");

            loadAccounts();
            loadTransactions(selectedAccount);

        } catch (error) {
            console.error(error);
            setMessage("Withdrawal failed.");
        }
    }

    async function transferMoney() {

        try {

            await bankApi.post(
                "/accounts/transfer",
                {
                    fromAccountId: transfer.fromAccountId,
                    toAccountId: transfer.toAccountId,
                    amount: Number(transfer.amount)
                }
            );

            setMessage("Transfer successful.");

            setTransfer({
                fromAccountId: "",
                toAccountId: "",
                amount: ""
            });

            loadAccounts();

        } catch (error) {
            console.error(error);
            setMessage("Transfer failed.");
        }
    }

    return (
        <main className="page">

            <h1>Admin Transactions</h1>

            <section className="panel">

                <h2>Deposit Money</h2>

                <select
                    value={selectedAccount}
                    onChange={(e) => {
                        setSelectedAccount(e.target.value);
                        loadTransactions(e.target.value);
                    }}
                >

                    <option value="">
                        Select Account
                    </option>

                    {accounts.map(account => (

                        <option
                            key={account.id}
                            value={account.id}
                        >

                            {account.accountType} - ${account.balance}

                        </option>

                    ))}

                </select>

                <br /><br />

                <input
                    type="number"
                    placeholder="Deposit Amount"
                    value={depositAmount}
                    onChange={(e) =>
                        setDepositAmount(e.target.value)
                    }
                />

                <br /><br />

                <button
                    className="primary-button"
                    onClick={deposit}
                >
                    Deposit
                </button>

                <hr />

                <h2>Withdraw Money</h2>

                <select
                    value={selectedAccount}
                    onChange={(e) => {
                        setSelectedAccount(e.target.value);
                        loadTransactions(e.target.value);
                    }}
                >

                    <option value="">
                        Select Account
                    </option>

                    {accounts.map(account => (

                        <option
                            key={account.id}
                            value={account.id}
                        >

                            {account.accountType} - ${account.balance}

                        </option>

                    ))}

                </select>

                <br /><br />

                <input
                    type="number"
                    placeholder="Withdraw Amount"
                    value={withdrawAmount}
                    onChange={(e) =>
                        setWithdrawAmount(e.target.value)
                    }
                />

                <br /><br />

                <button
                    className="primary-button"
                    onClick={withdraw}
                >
                    Withdraw
                </button>

                <hr />

                <h2>Transfer Money</h2>

                <select
                    value={transfer.fromAccountId}
                    onChange={(e) =>
                        setTransfer({
                            ...transfer,
                            fromAccountId: e.target.value
                        })
                    }
                >

                    <option value="">
                        From Account
                    </option>

                    {accounts.map(account => (

                        <option
                            key={account.id}
                            value={account.id}
                        >

                            {account.accountType} - ${account.balance}

                        </option>

                    ))}

                </select>

                <br /><br />

                <select
                    value={transfer.toAccountId}
                    onChange={(e) =>
                        setTransfer({
                            ...transfer,
                            toAccountId: e.target.value
                        })
                    }
                >

                    <option value="">
                        To Account
                    </option>

                    {accounts.map(account => (

                        <option
                            key={account.id}
                            value={account.id}
                        >

                            {account.accountType} - ${account.balance}

                        </option>

                    ))}

                </select>

                <br /><br />

                <input
                    type="number"
                    placeholder="Transfer Amount"
                    value={transfer.amount}
                    onChange={(e) =>
                        setTransfer({
                            ...transfer,
                            amount: e.target.value
                        })
                    }
                />

                <br /><br />

                <button
                    className="primary-button"
                    onClick={transferMoney}
                >
                    Transfer
                </button>

                <hr />

                <h2>Transaction History</h2>

                <table className="data-table">

                    <thead>

                        <tr>

                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {transactions.map(transaction => (

                            <tr key={transaction.id}>

                                <td>{transaction.type}</td>
                                <td>${transaction.amount}</td>
                                <td>{transaction.timestamp}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <br />

                <strong>{message}</strong>

            </section>

        </main>
    );
}

export default TransactionsPage;