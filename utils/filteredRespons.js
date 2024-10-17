export function filteredResponse(response) {
  const filterObject = (obj) => {
    const { id, createdAt, updatedAt, deletedAt, ...rest } = obj;
    return rest;
  };

  try {
    if (Array.isArray(response)) {
      return response.map(filterObject);
    } else if (typeof response === "object" && response !== null) {
      return filterObject(response);
    } else {
      return response;
    }
  } catch (error) {
    console.error("Error in filteredResponse:", error);
    return response;
  }
}
