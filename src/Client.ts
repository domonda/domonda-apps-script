const DOMONDA_GRAPHQL_API = "https://domonda.app/api/public/graphql";

/** Creates a client for interacting with the domonda GraphQL API. */
function createClient(token: string) {
  function query<T extends Record<PropertyKey, any> = Record<PropertyKey, any>>(
    query: string,
    variables?: Record<string, string | number | boolean>
  ): T {
    const response = UrlFetchApp.fetch(DOMONDA_GRAPHQL_API, {
      method: "post",
      headers: { Authorization: "Bearer " + token },
      contentType: "application/json",
      payload: JSON.stringify({ query, variables }),
    });
    const json = JSON.parse(response.getContentText());
    return json.data;
  }

  function documentsBetween(fromDate: string, untilDate: string) {
    const data = query(
      `query documentsBetween($fromDate: Date!, $untilDate: Date!) {
        filterDocuments(dateFilterType: DOCUMENT_DATE, fromDate: $fromDate, untilDate: $untilDate) {
          nodes {
            importedAt
            invoice: invoiceByDocumentRowId {
              partnerName
              partnerVatID: partnerVatRowIdNo
              invoiceDate
              invoiceNumber
              totalInEur
            }
          }
        }
      }`,
      { fromDate, untilDate }
    );
    return nodesToRows(data.filterDocuments.nodes);
  }

  return {
    query,
    documentsBetween,
  };
}
