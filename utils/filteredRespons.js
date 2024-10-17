export async function filteredResponse(response) {
  try {
    const newRespons = response.map((value) => {
      const { id, createdAt, updatedAt, deletedAt, ...rest } = value;
      return rest;
    });

    return newRespons;
  } catch (error) {
    console.log(error);
  }
}
