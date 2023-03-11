ROUTE="src/routes/$1.txt";
IDA="corredores/morado/$1_i.txt";
VUELTA="corredores/morado/$1_v.txt";

cat $IDA >> $ROUTE;
cat $VUELTA >> $ROUTE;
ghead -n -1 $ROUTE > temp.txt;
mv temp.txt $ROUTE;
rm $IDA $VUELTA;
