import { useEffect, useState } from "react";
import bankApi from "../../api/bankApi";

function MyAccountsPage() {

    // Temporary until login is added tomorrow
    const customerId = "6a567cb37de1c2533d9f3985";

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        loadAccounts();
    }, []);

    async function loadAccounts() {

        const response =
            await bankApi.get(
                `/accounts/customer/${customerId}`
            );

        setAccounts(response.data);

    }

    return (

        <main className="page">

            <h1>My Accounts</h1>

            <div className="dashboard-grid">

                {accounts.map(account => (

                    <div
                        className="card"
                        key={account.id}
                    >

                        <h2>{account.accountType}</h2>

                        <h3>

                            $

                            {Number(account.balance)
                                .toLocaleString()}

                        </h3>

                    </div>

                ))}

            </div>

        </main>

    );

}

export default MyAccountsPage;