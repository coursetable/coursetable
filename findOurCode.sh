find . -type f \
  | grep -v '\./\.' \
  | grep -v '\./web/gen' \
  | grep -v '\./web/libs' \
  | grep -v '\./web/restricted'
