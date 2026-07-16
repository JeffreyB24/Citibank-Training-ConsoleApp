function MyTransactionsHistoryPage() {
  return (
    <main className="page">
      <h1>Transaction History</h1>
      <p>Your recent transactions will appear here.</p>

      <section className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="4">No transactions available.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default MyTransactionsHistoryPage;