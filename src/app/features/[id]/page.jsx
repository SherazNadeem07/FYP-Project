'use client';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import PitchDetail from '../../../components/PitchDetail';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFeaturesData } from '../../../Redux/Slices/featureCardSlice';

export default function PitchPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cards, loading, error } = useSelector((state) => state.features);
  const [card, setCard] = useState(null);

  useEffect(() => {

    if (cards.length === 0) {
      dispatch(fetchFeaturesData());
    }
  }, [dispatch, cards.length]);

useEffect(() => {
  if (cards && id) {
    const foundCard = cards.find(card => card.id === Number(id));
    setCard(foundCard || null);
  }
}, [cards, id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Loading pitch details...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Error: {error}</div>;
  }

  if (!card && !loading && cards.length > 0) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Pitch not found</div>;
  }

  return card ? <PitchDetail card={card} /> : null;
}