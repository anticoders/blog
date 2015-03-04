TARGET=${1:-develop}

case $TARGET in
  "develop")
    echo "///////////////////////////////////////"
    echo "// running with development settings //"
    echo "///////////////////////////////////////"
    ;;
  *)
    echo "wrong target"
    echo "must be either develop or staging"
    exit 1
    ;;
esac

meteor --settings config/$TARGET.json


