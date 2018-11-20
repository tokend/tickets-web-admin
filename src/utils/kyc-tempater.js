export function fromKycTemplate (template, id) {
  return {
    blob_id: id,
    first_name: template.first_name,
    last_name: template.last_name
  }
}
