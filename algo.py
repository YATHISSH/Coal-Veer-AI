def buttons(text):
    #text="hi [1] 2^[buttons:hi,hello]^ 4"
    if '^' in text:
        start=text.index('^')
        end=len(text)-text[::-1].index('^')
        #print(text[start:end-1])
        a=text[start:end]
        print(a)
        b=text[start+2:end-2]
        b=b[8:]
        l=b.split(',')
        print(l)
        print(text[:start]+text[end:])
        return [l,text[:start]+text[end:]]
    else:
        return [False,text]