# See: https://hasura.io/docs/2.0/deployment/postgres-requirements/#2-a-single-role-to-manage-metadata-and-user-objects-in-the-same-database
# We just need to create the user here; the fetched ferry-dump.sql script
# will handle the ownership part.
# And then after setting up the tables, hasura-perms.sh will add privileges
# for the public tables.
psql -U ${DB_USER} <<-END
  CREATE USER ${HASURA_DB_USER} WITH PASSWORD '${HASURA_DB_PASSWORD}';
  CREATE USER ${FERRY_DB_USER} WITH PASSWORD '${FERRY_DB_PASSWORD}';
END
