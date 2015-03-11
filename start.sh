TARGET=${1:-default}

case $TARGET in
  "default")
    echo "-----------------------------------"
    echo "|| running with default settings ||"
    echo "-----------------------------------"
    ;;
  *)
    if [ -f config/$TARGET.json ]
    then
      echo "----------------------------------"
      echo "|| running with custom settings ||"
      echo "----------------------------------"
    else
      echo "wrong target; file config/${TARGET}.json does not exist"
      exit 1
    fi
    ;;
esac

meteor --settings config/$TARGET.json
