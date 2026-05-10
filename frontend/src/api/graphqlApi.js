const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:3001/graphql";

export async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "GraphQL request failed");
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || "GraphQL request failed");
  }

  return json.data;
}

export const getDashboardGraphQL = async () => {
  return graphqlRequest(`
    query DashboardData {
      dashboardSummary {
        totalEnergy
        dailyCost
        usageTime
        total_energy_kwh
        total_estimated_cost
        total_hours_used
      }

      dashboardByDevice {
        id
        name
        device_type
        total_energy_kwh
        total_estimated_cost
        total_hours_used
      }

      dashboardByRoom {
        id
        name
        total_energy_kwh
        total_estimated_cost
        total_hours_used
      }

      dashboardByPeriod {
        date
        total_energy_kwh
        total_estimated_cost
        total_hours_used
      }
    }
  `);
};