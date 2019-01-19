find . -type f \
  | grep -v '\./\.' \
  | grep -v '\./crawler/dist' \
  | grep -v '\./crawler/dist-includes' \
  | grep -v '\./crawler/libraries' \
  | grep -v '\./web/gen' \
  | grep -v '\./web/libs' \
  | grep -v '\./web/restricted'
