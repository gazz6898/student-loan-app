for pkg in packages/libs/*/package.json; do
  name=$(sed -rn "s/\"name\": \"(.+)\",/\1/p" "${pkg}" | xargs)
  (npm v "${name}" version 2>/dev/null) || (
    echo "You need to do the initial publish for ${name} before it can be auto-published!"
  )
done
