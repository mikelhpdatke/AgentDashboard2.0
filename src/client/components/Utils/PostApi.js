export async function PostApi(url, json) {
  const myRequest = new Request(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
  const result = fetch(myRequest)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      console.log('Something went wrong on api server!');
    })
    .then(response => response)
    .catch(error => {
      console.log(`Stm went wronggggg${error}`);
    });
  return result;
}
