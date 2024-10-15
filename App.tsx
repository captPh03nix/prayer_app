import { useState } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";

export default function PrayerCounter() {
  const [prayerCount, setPrayerCount] = useState(0);
  const [addPrayerAmount, setAddPrayerAmount] = useState(0);
  const [usePrayerAmount, setUsePrayerAmount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleAddPrayer = () => {
    setPrayerCount(prayerCount + addPrayerAmount);
    setAddPrayerAmount(0);
  };

  const handleUsePrayer = () => {
    if (usePrayerAmount > prayerCount) {
      alert("You don't have enough prayers to use.");
    } else {
      setPrayerCount(prayerCount - usePrayerAmount);
      setUsePrayerAmount(0);
    }
  };

  return (
    <div className="bg-yellow-200 min-h-screen p-4">
      <Card className="bg-yellow-100 max-w-md mx-auto p-4">
        <CardHeader>
          <CardTitle>Prayer Counter</CardTitle>
          <CardDescription>Accumulate and store prayers in your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-2 mb-4">
            <p className="text-lg font-bold">Current Prayer Count</p>
            <p className="text-5xl font-bold">{prayerCount}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="add-prayer-amount">Add Prayers:</Label>
            <Input type="number" id="add-prayer-amount" value={addPrayerAmount} onChange={(e) => setAddPrayerAmount(parseInt(e.target.value))} />
            <Button onClick={handleAddPrayer}>Add Prayers</Button>
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <Label htmlFor="use-prayer-amount">Use Prayers:</Label>
            <Input type="number" id="use-prayer-amount" value={usePrayerAmount} onChange={(e) => setUsePrayerAmount(parseInt(e.target.value))} />
            <Button onClick={handleUsePrayer}>Use Prayers</Button>
          </div>
          <Button variant="secondary" onClick={() => setShowInstructions(!showInstructions)}>How to use</Button>
          {showInstructions && (
            <div className="mt-4">
              <p>Instructions:</p>
              <ul>
                <li>Enter the number of prayers you want to add or use in the corresponding input field.</li>
                <li>Click the "Add Prayers" or "Use Prayers" button to update your prayer count.</li>
                <li>Note: You cannot use more prayers than you have accumulated.</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}