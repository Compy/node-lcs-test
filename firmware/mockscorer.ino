void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("HEARTBEAT|1");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("SCORE|1");
  delay(5000);
}
