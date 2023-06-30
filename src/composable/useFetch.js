import { ref } from "vue";

export default function useFetch(url, options = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const { signal, abort } = new AbortController();

  loading.value = true;

  const baseURL = "https://www.wrike.com/api/v4/";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application.json",
    Authorization:
      "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODQxNDU3NixcImNcIjo0NjM1ODE0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NjYyNTUzMDh9.8OCwkj8xXpvsAsky9zoKn-vjKDmtYBT3rQ3UTIEX6yw",
  };

  if (options.headers) {
    options.headers = { ...headers, ...options.headers };
  }

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseURL}${url}`, { signal, ...options });
      if (!res.ok) {
        error.value = "could not fetch data.";
      }
      data.value = await res.json();
    } catch (err) {
      error.value = err.message;
    }
    loading.value = false;
  };

  return { data, error, loading, abort, fetchData };
}
